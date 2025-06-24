import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class NameValidationPipe implements PipeTransform {
  transform(name: string): string {
    if (!name || name.length < 3 || name.length > 25 || !/[^a-z]/i.test(name))
      throw new BadRequestException(
        `Le nom doit avoir une taille entre 3 et 25, et doit être composé uniquement de lettre`,
      );
    return name;
  }
}
