import { ReadingLocationService } from '../reader/reading-location.service';

export class ReadingProgress {
  constructor(
    public percentage: number = null,
    public locations: any = null
  ) {}

  restorePercentage(rlService: ReadingLocationService, book: { key: string }) {
    this.percentage = rlService.getCfi(book.key).percentage;
  }

  fetchLocations(epub: any) {
    epub.locations
      .generate()
      .then(() => {
        this.locations = epub.locations;
      })
      .catch(() => {
        console.log('Error occurs');
      });
  }
}
