import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class NameValidationPipe implements PipeTransform {
  transform(name: string): string {
    const nameRegex = /^[a-zA-Z0-9_\-']{3,20}$/;
    if (!nameRegex.test(name)) {
      console.log(name);
      throw new BadRequestException(
        `Le nom doit avoir une taille entre 3 et 25, et doit être composé uniquement de lettre`,
      );
    }
    return name.trim();
  }
}
