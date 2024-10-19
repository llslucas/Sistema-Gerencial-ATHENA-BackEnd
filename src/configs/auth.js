const config = {
    jwt: {
        secret: process.env.AUTH_SECRET || "default",
        expiresIn: "24h"
    }
}

export default config;