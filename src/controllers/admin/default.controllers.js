
const { generateUniqueSlug } = require("../../config/slugGenrate");
const defaultModel = require("../../modules/admin/default");
var slugify = require('slugify');
exports.create = async (request, response) => {
    const dataSave = request.body;
    let slug = slugify(dataSave.title, {
        lower: true,
        strict: true,
    });
    dataSave.slug = await generateUniqueSlug(defaultModel, slug)
    defaultModel(dataSave).save()
        .then((result) => {
            const data = {
                _status: true,
                _message: "Data Create Succesfully",
                _data: result,
            }
            response.send(data);
        }).catch((error) => {
            const data = {
                _status: false,
                _message: "Something went wrong",
                _error: error,
                _data: '',
            }
            response.send(data);
        })
}
exports.view = async (request, response) => {
    const andCondition = [{
        delete_at: null,

    }]
    let orCondition = []
    var limit = 5;
    var page = 1;
    if (request.body.limit) {
        limit = Number(request.body.limit);
    }
    if (request.body.page) {
        page = Number(request.body.page);
    }
    if (request.body.title) {
        var nameRegex = new RegExp(request.body.title, "i")

        andCondition.push({ title: nameRegex })
    }

    if (orCondition.length > 0) {
        andCondition.push({
            $or: orCondition,
        })
    }
    let filterData = {
        $and: andCondition,
    }
    const skip = (page - 1) * limit;
    try {
        const totalRecord = await defaultModel.find(filterData).countDocuments();
        defaultModel.find(filterData)
            .limit(limit)
            .skip(skip)
            .then((result) => {
                const data = {
                    _status: true,
                    _message: "Data Find Succesfully",
                    _data: result,
                    current_page: page,
                    limit: limit,
                    totalRecords: totalRecord,
                    totalPages: Math.ceil(totalRecord / limit)
                }
                response.send(data);
            })
            .catch((error) => {
                const data = {
                    _status: false,
                    _message: "Something went wrong",
                    error: error,
                    _data: []
                }
                response.send(data);
            })
    }
    catch (error) {
        const data = {
            _status: false,
            _message: "Something went wrong",
            _error: error,
            _data: []
        }
        response.send(data);

    }
}
exports.details = async (request, response) => {

    try {
        const id = request.params.id;

        const result = await defaultModel.findOne({
            _id: id,
            delete_at: null
        })

        if (!result) {
            response.send({
                _status: false,
                _message: "Record Not Found",
                _data: []
            });
        }
        response.send({
            _status: true,
            _message: "Data Find Suceesfully",
            _data: result
        })

    } catch (error) {
        response.send({
            _status: false,
            _message: "Something went Wrong",
            _data: '',
            _error: error
        })

    }
}
exports.update = async (request, response) => {
    try {

        const id = request.params.id;
        const updateData = { ...request.body };

        if (request.body.title) {
            let slug = slugify(updateData.title, {
                lower: true,
                strict: true,
            });
            updateData.slug = await generateUniqueSlug(
                defaultModel,
                slug,
                id
            );
        }

        const result = await defaultModel.findOneAndUpdate({
            _id: id,
            delete_at: null
        }, {
            $set: updateData
        }, {
            new: true,
            runValidators: true
        })

        if (!result) {
            response.send({
                _status: false,
                _message: "Record Not Found",
                _data: ''
            });
        }

        response.send({
            _status: true,
            _message: "Data Update Succesfully",
            _data: result,

        });



    } catch (error) {
        const data = {
            _status: false,
            _message: "Something went wrong",
            error: error,
            _data: []
        }
        response.send(data);
    }

}
exports.changeStatus = async (request, response) => {
    try {
        const id = request.params.id;

        const data = await defaultModel.findOne({
            _id: id,
            delete_at: null
        });

        if (!data) {
            return response.send({
                _status: false,
                _message: "Data not found",
                _data: []
            });
        }

        const result = await defaultModel.findOneAndUpdate(
            {
                _id: id,
                delete_at: null
            },
            {
                $set: {
                    status: !data.status
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        response.send({
            _status: true,
            _message: "Status Updated Successfully",
            _data: result
        });

    } catch (error) {
        response.send({
            _status: false,
            _message: "Something went wrong",
            error: error,
            _data: []
        });
    }
};
exports.softDelete = async (request, response) => {
    try {
        const id = request.params.id;

        const data = await defaultModel.findOne({
            _id: id,
            delete_at: null
        });

        if (!data) {
            return response.send({
                _status: false,
                _message: "Data not found",
                _data: []
            });
        }

        const result = await defaultModel.findOneAndUpdate(
            {
                _id: id,
                delete_at: null
            },
            {
                $set: {
                    delete_at: Date.now()
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        response.send({
            _status: true,
            _message: "Product Delete Successfully",
            _data: result
        });

    } catch (error) {
        response.send({
            _status: false,
            _message: "Something went wrong",
            error: error,
            _data: []
        });
    }
};