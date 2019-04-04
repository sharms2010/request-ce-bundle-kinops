import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { context } from '../../redux/store';

const ViewDiscussionButton = props =>
  props.isSmallLayout &&
  props.hasDiscussions && (
    <button
      type="button"
      onClick={props.handleClick}
      className="btn btn-outline-info"
    >
      View Discussion
    </button>
  );

export const mapStateToProps = state => ({
  isSmallLayout: state.app.layoutSize === 'small',
  hasDiscussions: state.submission.discussion !== null,
});

const enhance = compose(
  connect(
    mapStateToProps,
    null,
    null,
    {
      context,
    },
  ),
  withHandlers({
    handleClick: props => () => {
      props.openDiscussion();
    },
  }),
);

export const ViewDiscussionButtonContainer = enhance(ViewDiscussionButton);
