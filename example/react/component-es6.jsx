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
      <div>
        <p>external React ES6 markup</p>
        <p>{this.state.title}</p>
          <p>{this.props.providedProp}</p>
          <p className={this.props.modifier_class}>modifier class goes here</p>
      </div>
    );
  }
}

export default SampleComponent;
