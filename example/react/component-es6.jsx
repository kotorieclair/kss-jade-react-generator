import React from 'react';

class SampleComponent extends React.Component() {
  constructor() {
    super();

    this.state = {
      title: "this is title",
    };
  }

  render() {
    return (
      <div>
        <p>external react es6 markup</p>
        <p>{this.state.title}</p>
      </div>
    );
  }
}

export default SampleComponent;
