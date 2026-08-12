const mongoose = require('mongoose');

const defaultSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        validate: {
            validator: async function (v) {
                let query = {
                    title: v,
                    delete_at: null,
                }

                const currenId = (this.getQuery && this.getQuery()._id) || this._id
                if(currenId){
                    query._id = {$ne: currenId};
                }
                console.log(query)

                const existing = await defaultModel.findOne(query);

                return !existing; 

                
            },
            message: props => `This Specified Title is already in use.`
        }

    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
    },
    image: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: true
    },
    delete_at: {
        type: Date,
        default: null
    },

}, 
{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    },
    versionKey: false
})

const defaultModel =  mongoose.model('default', defaultSchema);
module.exports = defaultModel