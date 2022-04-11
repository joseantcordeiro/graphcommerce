import { Test, TestingModule } from '@nestjs/testing';
import { SupertokensService } from '.';

describe('SupertokensService', () => {
  let service: SupertokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupertokensService],
    }).compile();

    service = module.get<SupertokensService>(SupertokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
