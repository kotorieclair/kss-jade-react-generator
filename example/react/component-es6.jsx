import React from 'react';

class SampleComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      title: "this is state.title",
    };
  }

  render() {
    return (
      <div className="react-1">
        <p>external React ES6 markup</p>
        <p>{this.state.title}</p>
          <p>{this.props.providedProp}</p>
      </div>
    );
  }
}

export default SampleComponent;
