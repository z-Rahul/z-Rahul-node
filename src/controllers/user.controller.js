const User = require("../schema/user.schema");

module.exports.getUsersWithPostCount = async (req, res) => {
    try {
        const {page, limit} = req.query;
        const pageNumber = page ? parseInt(page) : 1;
        const resultLimit = limit ? parseInt(limit) : 10;

        const pipeline = [
            {
                $facet: {
                    metadata: [
                        {$count: "totalDocs"},
                        {
                            $addFields: {
                                totalPages: {
                                    $ceil: {$divide: ["$totalDocs", resultLimit]},
                                },
                                page: pageNumber,
                                limit: resultLimit,
                            },
                        },
                    ],
                    users: [
                        {$skip: (pageNumber - 1) * resultLimit},
                        {$limit: resultLimit},
                        {
                            $lookup: {
                                from: "posts", // the collection name is "posts"
                                localField: "_id",
                                foreignField: "userId",
                                as: "posts",
                            },
                        },
                        {
                            $addFields: {
                                posts: {$size: "$posts"},
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                posts: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: "$metadata",
            },
            {
                $project: {
                    data: {
                        users: "$users",
                        pagination: {
                            totalDocs: "$metadata.totalDocs",
                            limit: "$metadata.limit",
                            page: "$metadata.page",
                            totalPages: "$metadata.totalPages",
                            pagingCounter: {
                                $add: [(pageNumber - 1) * resultLimit, 1],
                            },
                            hasPrevPage: {$gt: ["$metadata.page", 1]},
                            hasNextPage: {
                                $lt: ["$metadata.page", "$metadata.totalPages"],
                            },
                            prevPage: {
                                $cond: [
                                    {$gt: ["$metadata.page", 1]},
                                    {$subtract: ["$metadata.page", 1]},
                                    null,
                                ],
                            },
                            nextPage: {
                                $cond: [
                                    {$lt: ["$metadata.page", "$metadata.totalPages"]},
                                    {$add: ["$metadata.page", 1]},
                                    null,
                                ],
                            },
                        },
                    },
                },
            },
        ];

        const [data] = await User.aggregate(pipeline);
        return res.status(200).json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
