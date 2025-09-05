import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiGoneResponse,
} from '@nestjs/swagger';

export function ApiJoinRoomErrors() {
  return applyDecorators(
    ApiNotFoundResponse({ description: 'Room not found' }),
    ApiForbiddenResponse({ description: 'Room is full' }),
    ApiGoneResponse({ description: 'Room is no longer active' }),
  );
}

export function ApiLeaveRoomErrors() {
  return applyDecorators(
    ApiNotFoundResponse({ description: 'Room not found' }),
  );
}
