export class OaBase64 {
  private PADCHAR = '=';
  private ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  private getByte(s: string, i: number): number {
    const x = s.charCodeAt(i);
    return x;
  }

  private getByte64(s: string, i: number): number {
    const idx = this.ALPHA.indexOf(s.charAt(i));
    return idx;
  }


  public encode(s: string): string {
    s = String(s);

    let i;
    let b10;
    const x = [];
    const imax = s.length - s.length % 3;

    if (s.length === 0) {
      return s;
    }

    for (i = 0; i < imax; i += 3) {
      b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8) | this.getByte(s, i + 2);
      x.push(this.ALPHA.charAt(b10 >> 18));
      x.push(this.ALPHA.charAt((b10 >> 12) & 63));
      x.push(this.ALPHA.charAt((b10 >> 6) & 63));
      x.push(this.ALPHA.charAt(b10 & 63));
    }

    switch (s.length - imax) {
      case 1:
        b10 = this.getByte(s, i) << 16;
        x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 63) + this.PADCHAR + this.PADCHAR);
        break;
      case 2:
        b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8);
        x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 63) + this.ALPHA.charAt((b10 >> 6) & 63) + this.PADCHAR);
        break;
    }

    return x.join('');
  }
}
