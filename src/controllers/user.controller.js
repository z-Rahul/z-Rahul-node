const User = require("../schema/user.schema");
const Post = require('../schema/post.schema');

async function PaginateUserResults(totalDocs, pageNumber, limit) {
    const totalPages = Math.ceil(totalDocs / limit);
    const skipCount = (pageNumber - 1) * limit;

    let results = await User.find({}).select("-__v").skip(skipCount).limit(limit).exec();

    return {
        pagination: {
            totalDocs,
            limit,
            page: pageNumber,
            totalPages,
            pagingCounter: skipCount + 1,
            hasPrevPage: pageNumber > 1,
            hasNextPage: pageNumber < totalPages,
            prevPage: pageNumber > 1 ? pageNumber - 1 : null,
            nextPage: pageNumber < totalPages ? pageNumber + 1 : null,
        },
        results
    };
}

module.exports.getUsersWithPostCount = async (req, res) => {
    try {
        //TODO: Implement this API
        const {page, limit} = req.query;

        const pageNumber = page ? parseInt(page) : 1
        const resultLimit = limit ? parseInt(limit) : 10

        let totalDocs = await User.estimatedDocumentCount();
        let {pagination, results} = await PaginateUserResults(totalDocs, pageNumber, resultLimit);
        let users = []

        for (let i = 0; i < results.length; i++) {
            let id = results[i]["_id"]
            let posts = await Post.find({userId: id}).exec();
            users[i] = {
                "_id": results[i]["_id"],
                "name": results[i]["name"],
                "posts": posts.length
            }
        }
        let data = {users, pagination}

        return res.status(200).json({data});

    } catch (error) {
        res.send({error: error.message});
    }
};