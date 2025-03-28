import { CanActivateChildFn } from '@angular/router';

export const childAuthGuard: CanActivateChildFn = (childRoute, state) => {
  return true;
};
