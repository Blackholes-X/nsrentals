import React, { Component } from 'react'

class Modal extends Component {
  render() {
    const { isOpen, onClose, children } = this.props

    if (!isOpen) {
      return null
    }

    return (
      <div style={styles.overlay}>
      <div
        style={{
          position: 'fixed',
          top: '10%',
          left: '25%',
          backgroundColor: 'white',
          right: '5%',
          padding: '20px',
          zIndex: 1000,
        
        }}
      >
        {/* Modal content */}
        {children}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 0, right: 0, padding: '10px', cursor: 'pointer' }}
        >
          X
        </button>
      </div>
      </div>
    )
  }

  
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Change the backgroundColor value here for transparent grey
    backgroundColor: 'rgba(128, 128, 128, 0.7)', // This is a medium grey with 70% opacity
    backdropFilter: 'blur(5px)',
    zIndex: 999, // Ensure it's below the modal content
  },
  modal: {
    position: 'fixed',
    top: '10%',
    left: '25%',
    backgroundColor: 'white',
    padding: '20px',
    zIndex: 1000, // Ensure it's above the overlay
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '10px',
    cursor: 'pointer',
  }
};


export default Modal
