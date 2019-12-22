import * as moment from 'moment';

export function mockCurrentTime(time: string): () => void {
  const date = moment(time, 'YYYY-MM-DDTHH:mm:ss').toDate();
  const backup = Date.now;
  Date.now = jest.fn((): number => date.valueOf());

  return (): void => {
    Date.now = backup;
  };
}
