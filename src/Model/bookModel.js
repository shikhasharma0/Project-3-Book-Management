const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId
const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        excerpt: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            required: true,
            type: objectId,
            ref: "User"
        },
        ISBN: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true
        },
        subcategory: {
            type: String,
            required: true
        },

        reviews: {
            type: Number,
            default: false
        },
        isPublished: {
            type: Boolean,
            default: false
        },

        publishedAt: {
            type: Date,
            default: null
        },

        deletedAt: {
            type: Date,
            default: null
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        releasedAt: {
         date: {
             reqiured: true,
             type: Date
            } 
        },

    }, { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);


