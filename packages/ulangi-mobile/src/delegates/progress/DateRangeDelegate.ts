import * as moment from 'moment';

export class DateRangeDelegate {
  public createRangeByNumberOfDays(numOfDays: number): [Date, Date] {
    const endDate = moment()
      .hour(23)
      .minute(59)
      .second(59)
      .toDate();

    const startDate = moment(endDate)
      .subtract(numOfDays - 1, 'days')
      .hour(0)
      .minute(0)
      .second(0)
      .toDate();

    return [startDate, endDate];
  }

  public createRangeByYear(year: number): [Date, Date] {
    const startDate = moment([year, 0, 1])
      .hour(0)
      .minute(0)
      .second(0)
      .toDate();
    const endDate = moment([year, 11, 31])
      .hour(23)
      .minute(59)
      .second(59)
      .toDate();

    return [startDate, endDate];
  }
}
