export class JsonUtil {
  static toObject(source: any) {
    if (source && typeof source == 'string') {
      return JSON.parse(source);
    }
    return source;
  }

  static toString(source: any) {
    if (source && typeof source != 'string') {
      return JSON.stringify(source);
    }
    return source;
  }
}
