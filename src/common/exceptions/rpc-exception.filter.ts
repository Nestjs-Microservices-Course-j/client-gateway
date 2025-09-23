import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {

    const context = host.switchToHttp();
    const res = context.getResponse();
    const  rcpError  = exception.getError();
   
    if( typeof rcpError === 'object' && 'status' in rcpError && 'message' in rcpError) {        
        const status  = isNaN(+rcpError.status) ? 400 : +rcpError.status
        return res.status(status).json(rcpError)  
    }

     res.status(400).json({
        status: 400,
        message: rcpError
    })  

  }
}