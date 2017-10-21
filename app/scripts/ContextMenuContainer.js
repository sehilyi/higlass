import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

// Styles
import '../styles/ContextMenu.module.scss';


// the size of the track controls
// taken from ../styles/TrackControl.module.css
const TRACK_CONTROL_HEIGHT = 20;

export class ContextMenuContainer extends React.Component {
  constructor(props) {
    /**
     * A window that is opened when a user clicks on the track configuration icon.
     */
    super(props);

    this.adjusted = false;

    this.state = {
      orientation: this.props.orientation ? this.props.orientation : 'right',
      left: this.props.position.left,
      top: this.props.position.top,
      submenuShown: null
    }
  }

  /* -------------------------- Life Cycle Methods -------------------------- */

  componentDidMount() {
    this.updateOrientation();
  }

  componentWillReceiveProps(newProps) {
    this.adjusted = false;

    this.setState({
      left: newProps.position.left,
      top: newProps.position.top
    });
  }

  componentDidUpdate() {
    this.updateOrientation();
  }

  /* ---------------------------- Custom Methods ---------------------------- */

  handleItemMouseEnter(evt, series) {
    this.setState({
      submenuShown: series,
      submenuSourceBbox: evt.currentTarget.getBoundingClientRect()
    });
  }

  handleMouseLeave() {
    return;
  }

  handleOtherMouseEnter() {
    this.setState({
      submenuShown: null
    });
  }

  /*
  handleSeriesMouseEnter(evt, uid) {
    let domNode = evt.currentTarget;

    this.setState({
      submenuShown: uid,
      submenuSourceBbox: domNode.getBoundingClientRect()
    });
  }

  handleMouseLeave(evt) {
    return;
  }

  handleOtherMouseEnter(evt) {
    this.setState({
      submenuShown: null
    });
  }
  */

  updateOrientation() {
    if (this.adjusted) return;

    this.adjusted = true;
    this.divDom = ReactDOM.findDOMNode(this.div);
    const bbox = this.divDom.getBoundingClientRect();

    const parentBbox = this.props.parentBbox ?
      this.props.parentBbox :
      {
        top: this.props.position.top,
        left: this.props.position.left,
        width: 0,
        height: 0
      };

    let orientation = this.state.orientation;

    let topPosition = parentBbox.top;

    if (parentBbox.top + bbox.height > window.innerHeight) {
      // goes off the bottom
      if (parentBbox.top - bbox.height > 0) {
        // will fit on top
        topPosition = parentBbox.top - bbox.height + TRACK_CONTROL_HEIGHT; 
      }
    }

    if (this.state.orientation === 'left') {
      let leftPosition = parentBbox.left - bbox.width;

      if (leftPosition < 0)  {
        if (parentBbox.left + parentBbox.width + bbox.width > window.innerWidth) {
          leftPosition = 0;  // goes off the side either way
        } else {
          // switch to the right
          leftPosition = parentBbox.left + parentBbox.width;
          orientation = 'right';
        }
      }

      // we're fine keeping it left oriented
      this.setState({
        left: leftPosition,
        top: topPosition,
        orientation: orientation
      });
    }  else {
      let leftPosition = parentBbox.left + parentBbox.width;

      if ((parentBbox.left + parentBbox.width + bbox.width) > window.innerWidth) {
        if (parentBbox.left - bbox.width < 0) {
          // goes off both sides
          leftPosition = 0;
          orientation = 'right';
        } else {
          leftPosition = parentBbox.left - bbox.width;
          orientation = 'left';

        }
      }

      this.setState({
        left: leftPosition,
        top: topPosition,
        orientation: orientation
      });
    }
  }

  /* ------------------------------ Rendering ------------------------------- */

  render() {
    const stylePosition = this.state.left ?
      {
        left: this.state.left
      } : {
        right: this.state.right
      };

    const otherStyle = {
      top: this.state.top
    };

    const wholeStyle = Object.assign(stylePosition, otherStyle);

    return(
      <div
        ref={c => this.div = c}
        style={wholeStyle}
        styleName="context-menu"
      >
        {this.props.children}
      </div>
    )
  }
}

ContextMenuContainer.propTypes = {
  children: PropTypes.node,
  orientation: PropTypes.string,
  parentBbox: PropTypes.object,
  position: PropTypes.object
}

export default ContextMenuContainer;