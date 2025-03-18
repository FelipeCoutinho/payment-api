import { Test, TestingModule } from '@nestjs/testing';
import { ExternalPaymentProviderService } from './externalPaymentProvider-resource.service';

describe('ExternalPaymentProviderService', () => {
  let service: ExternalPaymentProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalPaymentProviderService],
    }).compile();

    service = module.get<ExternalPaymentProviderService>(ExternalPaymentProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
