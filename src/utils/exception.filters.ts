import {RpcException} from "@nestjs/microservices";
import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus} from "@nestjs/common";
import {HttpAdapterHost} from "@nestjs/core";

export interface IRpcException {
    message: string;
    status: number;
}

export class FitRpcException extends RpcException implements IRpcException {
    constructor(message: string, statusCode: HttpStatus) {
        super(message);
        this.initStatusCode(statusCode);
    }
    public status: number;

    private initStatusCode(statusCode) {
        this.status = statusCode;
    }
}

@Catch()
export class AllGlobalExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: IRpcException, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const httpStatus = exception.status
            ? exception.status
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
            message: exception.message,
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}