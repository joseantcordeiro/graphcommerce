import { Inject } from '@nestjs/common';
import { MEILI_CLIENT } from '../../config/search';

export function InjectMeiliSearch() {
  return Inject(MEILI_CLIENT);
}