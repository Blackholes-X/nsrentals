import React, { Component } from 'react';

class Modal extends Component {
  render() {
    const { isOpen, onClose, children } = this.props;

    if (!isOpen) {
      return null;
    }

    return (


<div style={{position: 'fixed', top: '10%', left: '25%', backgroundColor: 'white', right:'5%', padding: '20px', zIndex: 1000}}>
{/* Modal content */}
{children}

{/* Close button */}
<button onClick={this.props.onClose} style={{position: 'absolute', top: 0, right: 0, padding: '10px', cursor: 'pointer'}}>X</button>
</div>

    );
  }
}
export default Modal;