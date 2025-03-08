export class ServiceTax {
    constructor(
      readonly totalPayment: number,
      readonly servicePercent: number,
      readonly taxPercent: number,
    ) {}
  
    getService(): number {
      return (this.totalPayment * this.servicePercent) / 100;
    }
  
    calculateService(): number {
      return this.getService() + this.totalPayment;
    }
  
    getTax(): number {
      return (this.calculateService() * this.taxPercent) / 100;
    }
  
    calculateTax(): number {
      return this.getTax() + this.calculateService();
    }
  }