import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { ViewDiscussionsModal, DiscussionsPanel } from 'discussions';

export const RequestDiscussionComponent = ({
  submission,
  viewDiscussionModal,
  isSmallLayout,
  closeDiscussion,
  me,
}) => (
  <div className="recent-discussions-wrapper kinops-discussions d-none d-md-flex">
    {viewDiscussionModal && isSmallLayout ? (
      <ViewDiscussionsModal
        close={closeDiscussion}
        itemType="Submission"
        itemKey={submission.id}
        me={me}
        modalBodyClassName="services-submission-discussion"
      />
    ) : (
      <DiscussionsPanel itemType="Submission" itemKey={submission.id} me={me} />
    )}
  </div>
);

export const mapStateToProps = state => ({
  me: state.app.profile,
  isSmallLayout: state.app.layout.get('size') === 'small',
});

export const mapDispatchToProps = {};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
);

export const RequestDiscussion = enhance(RequestDiscussionComponent);
