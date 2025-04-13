import { Details } from './Details';
import { Groups } from './Groups';
import { Status } from './Status';

export function FirstColumn() {
  return (
    <div className="column-wrapper">
      <Status />
      <Details />
      <Groups />
    </div>
  );
}
