import { ApiProperty } from '@nestjs/swagger';

export class ExternalPaymentStatusDto {
  @ApiProperty({ example: 'b018b23b-9931-4438-b55f-782edb05b4c2' })
  tx_id: string;

  @ApiProperty({ example: 'processed' })
  status: string;
}
