import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentCreateDto } from '../dto/payment-create.dto';
import { PaymentStatusDto } from '../dto/payment-status.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({
    status: 201,
    type: PaymentCreateDto,
    description: 'Created',
  })
  async initiatePayment(@Body() createpaymentDto: PaymentCreateDto) {
    return await this.paymentService.initiatePayment(createpaymentDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List all payments',
    type: PaymentCreateDto,
    isArray: true,
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findall() {
    return await this.paymentService.ListAll();
  }

  @Get(':paymentId')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'List all payments',
    type: PaymentStatusDto,
    isArray: true,
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findByPaymentID(@Param('paymentId') paymentId: string) {
    return await this.paymentService.ListByPaymentId(paymentId);
  }
}
