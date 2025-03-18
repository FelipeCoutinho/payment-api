import { IsNumber, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../enum/payment-enum';

export class PaymentCreateDto {
  @ApiProperty({ example: 3452, description: 'Payment amount in cents' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'BRL', description: 'Currency code (ISO 4217)' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'PAYPAL', enum: PaymentMethod, description: 'Payment method' })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({
    example: '87e9646a-b513-465d-b58d-6df44b9e4925',
    description: 'ID of the related product',
    name: 'product_id',
  })
  @IsString()
  productId: string;
}
