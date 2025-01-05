export class BaseError {
    code: number
    message: string

    constructor (code: string | number | undefined, message: string) {
        this.code = (() => {
            if (code === undefined) {
                return 500
            }

            if (typeof code === 'string') {
                // Code from postgrees error
                // -> extend the postgrees error to status code here
                if (code == 'PGRST116') {
                    // The result contains 0 rows
                    return 404
                }

                return Number.parseInt(code)
            } else {
                return code
            }
        })()

        this.message = message
    }
}

export const useErrorHandler = () => {
    const errorHandler = (error: BaseError) => {
        switch (error.code) {
            case 404:
                showError({
                    statusCode: 404,
                    statusMessage: 'Page Not Found',
                })
                break
            case 401:
                showError({
                    statusCode: error.code,
                    statusMessage: `Unauthenticated: (${error.message})`,
                })
                break
            case 403:
                showError({
                    statusCode: error.code,
                    statusMessage: `Access Forbidden: (${error.message})`,
                })
                break
            case 500:
                showError({
                    statusCode: error.code,
                    statusMessage: `Internal Server Error: (${error.message})`,
                })
                break
            case 503:
                showError({
                    statusCode: error.code,
                    statusMessage: `Service Unavailable: (${error.message})`,
                })
                break
            default:
                alert(error.message)
                break
        }
    }

    return {
        errorHandler,
    }
}
