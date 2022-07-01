const Facility = require("../models/facilityModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAyncErrors = require("../middleware/catchAsyncErrors");
const path = require('path');


//Get all Hotels => /api/v1/jobs
exports.getAll = async (req, res, next) => {
    const { params } = req
    const { facilityType } = params
    let facilities = null;
    if (facilityType) {
        facilities = await Facility.find({ facilityType })
    }
    else {
        facilities = await Facility.aggregate([
            {
                $facet: {
                    hotels: [

                        {
                            $match: {
                                "facilityType": "hotels",

                            },

                        }

                    ],
                    restaurants: [
                        {
                            $match: {
                                "facilityType": "restaurants"
                            }
                        }
                    ],
                    toursites: [
                        {
                            $match: {
                                "facilityType": "toursites"
                            }
                        }
                    ]
                },

            }
        ])

        if (facilities) {
            facilities = facilities[0]
        }
    }

    res.status(200).json({
        success: true,
        data: facilities,
    });
};


exports.getAllStats = async (req, res, next) => {

    const facilities = await Facility.aggregate([
        {
            $facet: {
                hotels: [

                    {
                        $match: {
                            "facilityType": "hotels",

                        },

                    }, {
                        '$count': 'count'
                    }

                ],
                restaurants: [
                    {
                        $match: {
                            "facilityType": "restaurants"
                        }
                    }, {
                        '$count': 'count'
                    }
                ],
                toursites: [
                    {
                        $match: {
                            "facilityType": "toursites"
                        }
                    }, {
                        '$count': 'count'
                    }
                ]
            },

        }
    ])


    res.status(200).json({
        success: true,
        data: facilities[0],
    });
};


exports.searchFacility = catchAyncErrors(async (req, res, next) => {
    let facilities = null
    const { query } = req


    console.log(query);

    if (Object.keys(query).length > 0) {
        const { location = "", category = "all" } = query
        if (query?.location) {
            if (category.toLowerCase() === "all") {
                facilities = await Facility.find({ location: { $regex: location, $options: 'i' } })
            }
            else {
                facilities = await Facility.find({ $and: [{ location: { $regex: location, $options: 'i' } }, { category: { $regex: category, $options: 'i' } }] })
            }
        }
        else if (location === "" && category.length > 0) {
            facilities = await Facility.find({ category: { $regex: category, $options: 'i' } })
        }
    }

    else {
        console.log("here");
        facilities = await Facility.find({})
    }

    res.status(200).json({
        success: true,
        count: facilities.length,
        data: facilities,
    });

})

exports.addFacility = catchAyncErrors(async (req, res, next) => {
    console.log(req)
    let galleryImages = [];
    const { params } = req
    const { facilityType } = params
    const supportedFiles = /.png|.jpg|.jpeg|.svg/;

        //console.log(req.body)

        

    if (facilityType.toLowerCase() === "hotels") {
        const categoryOpts = [
            "hotels",
            "motels",
            "resorts",
            "airbnds",
            "casino hotels",
            "hostels",
            "inns",
            "bed & breakfast",
            "bed and breakfast"
        ]

        // if (!req.body.hasOwnProperty('amenities') || req.body?.amenities.length === 0) {
        //     return next(new ErrorHandler("Hotels requires amenities", 400));
        // }

        // if (!categoryOpts.includes(req.body?.category.toLowerCase())) {
        //     return next(new ErrorHandler("Please select correct options for category", 400));
        // }

        // req.body.amenities = req.body.amenities.split(',')
    }
    else if (facilityType.toLowerCase() === "restaurants") {
        const categoryOpts = [
            "fast foods",
            "casual dining",
            "cafes",
            "pizzerias",
            "chinese",
            "italian",
            "turkish",
            "local cuisine",
            "fine dining",
            "pub"
        ]

        // if (!req.body.hasOwnProperty('deviveryService')) {
        //     return next(new ErrorHandler("Devivery Service option is required", 400));
        // }

        // if (!categoryOpts.includes(req.body?.category.toLowerCase())) {
        //     return next(new ErrorHandler("Please select correct options for category", 400));
        // }
    }
    else if (facilityType.toLowerCase() === "toursites") {
        // const categoryOpts = [
        //     "historical & heritage attractions",
        //     "historical and heritage attractions",
        //     "beaches",
        //     "national parks",
        //     "waterfalls",
        //     "mountains & hills",
        //     "mountains and hills",
        //     "islands",
        //     "forests",
        //     "entertainment parks",
        //     "wildlife attractions",
        //     "museums & art galleries",
        //     "museums and art galleries",
        //     "stadiums",
        //     "exhibitions",
        //     "festivals",
        //     "others"
        // ]

        // if (!req.body.hasOwnProperty('thingsTodo') || req.body?.thingsTodo.length === 0) {
        //     return next(new ErrorHandler("Things Todo is required", 400));
        // }
        // if (!req.body.hasOwnProperty('bestVisitingTime')) {
        //     return next(new ErrorHandler("Best Visiting Time is required", 400));
        // }

        // if (!categoryOpts.includes(req.body?.category.toLowerCase())) {
        //     return next(new ErrorHandler("Please select correct options for category", 400));
        // }
    }

    if (!req.files) {
        return next(new ErrorHandler('Please upload file.', 400));
    }
    const file = req.files.landingPageImage;
     const gallery = req.files.gallery;

    if (!supportedFiles.test(path.extname(file.name))) {
        return next(new ErrorHandler('Please upload images (png,jpg,jpeg).', 400))
    }



    gallery.map((item, idx) => {

        if (!supportedFiles.test(path.extname(item.name))) {
            return next(new ErrorHandler('Please upload images (png,jpg,jpeg).', 400))
        }

        item.name = `${Date.now()}_${idx}_${path.parse(file.name).ext}`;

        galleryImages.push(`/${facilityType}/${item.name}`)

        file.mv(`./public/${facilityType}/${item.name}`, err => {
            if (err) {
                console.log(err);
                return next(new ErrorHandler('Image upload failed.', 500));
            }

        });
    })


    file.name = `${Date.now()}${path.parse(file.name).ext}`;
    file.mv(`./public/${facilityType}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(new ErrorHandler('Image upload failed.', 500));
        }
    });

    req.body.landingPageImage = `/${facilityType}/${file.name}`
    req.body.gallery = galleryImages
    req.body.facilityType = facilityType




    const facility = await Facility.create(req.body);
    res.status(200).json({
        success: true,
        message: "successful",
        data: facility,
    });
});

// Get a single hotel by id   =>  /api/v1/hotel/:id
exports.getById = catchAyncErrors(async (req, res, next) => {
    const facility = await Facility.findOne({ _id: req.params.id })

    // if (!facility) {
    //     return next(new ErrorHandler("No record", 404));
    // }

    res.status(200).json({
        success: true,
        data: facility,
    });
});


