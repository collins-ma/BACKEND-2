// // const allowedOrigins = require('./allowedOrigins')

// // const corsOptions = {
// //     origin: (origin, callback) => {
// //         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
// //             callback(null, true)    
// //         } else {
// //             callback(new Error('Not allowed by CORS'))
// //         }
// //     },
// //     credentials: true,
// //     optionsSuccessStatus: 200
// // }

// // module.exports = corsOptions 






const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        console.log("Request Origin:", origin);  // Log the origin of the request
        console.log("Allowed Origins:", allowedOrigins);  // Log allowed origins for debugging

        if (!origin || allowedOrigins.includes(origin.trim())) {
            callback(null, true);
        } else {
            console.error("Blocked by CORS:", origin);  // Log when a request is blocked
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = corsOptions;