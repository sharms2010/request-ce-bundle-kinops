import React, { Fragment } from 'react';
import classNames from 'classnames';
import { Link } from '@reach/router';
import { PageTitle, Icon, TimeAgo, Utils as CommonUtils } from 'common';
import { bundle } from '@kineticdata/react';
import { RequestShowConfirmationContainer } from './RequestShowConfirmation';
import { RequestDiscussion } from './RequestDiscussion';
import { RequestActivityList } from './RequestActivityList';
import { CancelButtonContainer } from './CancelButton';
import { CommentButtonContainer } from './CommentButton';
import { CloneButtonContainer } from './CloneButton';
import { FeedbackButtonContainer } from './FeedbackButton';
import { ViewDiscussionButtonContainer } from './ViewDiscussionButton';
import { SendMessageModal } from './SendMessageModal';
import * as constants from '../../constants';
import {
  getDueDate,
  getDurationInDays,
  getStatus,
  getSubmissionPath,
} from '../../utils';
import { ReviewRequest } from './ReviewRequest';
import { I18n } from '../../../../app/src/I18nProvider';
import { isActiveClass } from '../../utils';

const getIcon = form =>
  CommonUtils.getAttributeValue(
    form,
    constants.ATTRIBUTE_ICON,
    constants.DEFAULT_FORM_ICON,
  );

const ProfileLink = ({ submitter }) => (
  <Link to={`/profile/${encodeURIComponent(submitter)}`}>
    {submitter === bundle.identity() ? <I18n>you</I18n> : submitter}
  </Link>
);

const StatusItem = ({ submission }) => (
  <div className="data-list-row__col">
    <dl>
      <dt>
        <I18n>Status</I18n>:
      </dt>
      <dd>
        <I18n>{getStatus(submission)}</I18n>
      </dd>
    </dl>
  </div>
);

const DisplayDateItem = ({ submission }) =>
  !submission.submittedAt ? (
    <div className="data-list-row__col">
      <dl>
        <dt>
          <I18n>Created</I18n>:
        </dt>
        <dd>
          <TimeAgo timestamp={submission.createdAt} />
        </dd>
        <dd>
          <em>
            <I18n>by</I18n>
          </em>
          {` `}
          <ProfileLink submitter={submission.createdBy} />
        </dd>
      </dl>
    </div>
  ) : (
    <div className="data-list-row__col">
      <dl>
        <dt>
          <I18n>Submitted</I18n>:
        </dt>
        <dd className="text-truncate">
          <TimeAgo timestamp={submission.submittedAt} />
          <br />
          <small>
            <I18n>by</I18n>
            {` `}
            <ProfileLink submitter={submission.submittedBy} />
          </small>
        </dd>
      </dl>
    </div>
  );

const ServiceOwnerItem = ({ submission }) => {
  const serviceOwner = CommonUtils.getConfig({
    submission,
    name: constants.ATTRIBUTE_SERVICE_OWNING_TEAM,
  });
  return (
    !!serviceOwner && (
      <div className="data-list-row__col">
        <dl>
          <dt>
            <I18n>Service Owning Team</I18n>:
          </dt>
          <dd>
            {serviceOwner} <I18n>Team</I18n>
          </dd>
        </dl>
      </div>
    )
  );
};

const EstCompletionItem = ({ submission }) => {
  const dueDate = getDueDate(submission, constants.ATTRIBUTE_SERVICE_DAYS_DUE);
  return (
    submission.coreState === constants.CORE_STATE_SUBMITTED &&
    !!dueDate && (
      <div className="data-list-row__col">
        <dl>
          <dt>
            <I18n>Est. Completion</I18n>:
          </dt>
          <dd>
            <TimeAgo timestamp={dueDate} />
          </dd>
        </dl>
      </div>
    )
  );
};

const CompletedInItem = ({ submission }) => {
  const duration =
    submission.coreState === constants.CORE_STATE_CLOSED &&
    getDurationInDays(submission.createdAt, submission.closedAt);
  return (
    (duration || duration === 0) && (
      <div className="data-list-row__col">
        <dl>
          <dt>
            <I18n>Completed in</I18n>:
          </dt>
          <dd>
            {duration} {duration === 1 ? <I18n>day</I18n> : <I18n>days</I18n>}
          </dd>
        </dl>
      </div>
    )
  );
};

export const RequestShow = ({
  submission,
  listType,
  mode,
  sendMessageModalOpen,
  viewDiscussionModal,
  discussion,
  openDiscussion,
  closeDiscussion,
  kappSlug,
  appLocation,
}) => (
  <div className="page-container page-container--panels page-container--services-submission page-container--no-padding">
    <div
      className={classNames(
        'page-panel page-panel--services-submission page-panel--scrollable',
        {
          'page-panel--three-fifths page-panel--no-padding ': discussion,
        },
      )}
    >
      <PageTitle parts={[submission && `#${submission.handle}`, 'Requests']} />
      {sendMessageModalOpen && <SendMessageModal submission={submission} />}
      <span className="services-color-bar services-color-bar__blue-slate" />
      <Link
        className="nav-return"
        to={`${appLocation}/requests/${listType || ''}`}
      >
        <span className="fa fa-fw fa-chevron-left" />
        <I18n>{listType || 'All'} Requests</I18n>
      </Link>
      {submission && (
        <Fragment>
          <div className="submission__meta">
            <div className="data-list-row">
              <StatusItem submission={submission} />
              <div className="data-list-row__col">
                <dl>
                  <dt>
                    <I18n>Confirmation #</I18n>
                  </dt>
                  <dd>{submission.handle}</dd>
                </dl>
              </div>
              <DisplayDateItem submission={submission} />
              <ServiceOwnerItem submission={submission} />
              <EstCompletionItem submission={submission} />
              <CompletedInItem submission={submission} />
              <div className="col-lg-auto btn-group-col">
                <ViewDiscussionButtonContainer
                  openDiscussion={openDiscussion}
                />
                <CloneButtonContainer submission={submission} />
                {submission.coreState === constants.CORE_STATE_SUBMITTED &&
                  !discussion && (
                    <CommentButtonContainer submission={submission} />
                  )}
                {submission.coreState === constants.CORE_STATE_CLOSED && (
                  <FeedbackButtonContainer submission={submission} />
                )}

                <CancelButtonContainer submission={submission} />
              </div>
            </div>
          </div>
          <div className="page-container page-container--submission">
            <div className="page-content">
              <div className="submission-title">
                <h1>
                  <Icon
                    image={getIcon(submission.form)}
                    background="greenGrass"
                  />
                  <I18n
                    context={`kapps.${kappSlug}.forms.${submission.form.slug}`}
                  >
                    {submission.form.name}
                  </I18n>
                </h1>
                {submission.form.name !== submission.label && (
                  <p>{submission.label}</p>
                )}
              </div>

              {mode === 'confirmation' && (
                <div className="card card--submission-confirmation">
                  <RequestShowConfirmationContainer submission={submission} />
                </div>
              )}

              <div className="submission-tabs">
                <ul className="nav nav-tabs">
                  <li role="presentation">
                    <Link
                      to={getSubmissionPath(
                        appLocation,
                        submission,
                        null,
                        listType,
                      )}
                      getProps={isActiveClass('nav-link')}
                    >
                      <I18n>Timeline</I18n>
                    </Link>
                  </li>

                  <li role="presentation">
                    <Link
                      to={`${getSubmissionPath(
                        appLocation,
                        submission,
                        'review',
                        listType,
                      )}`}
                      getProps={isActiveClass('nav-link')}
                    >
                      <I18n>Review Request</I18n>
                    </Link>
                  </li>
                </ul>
                <div className="submission-tabs__content">
                  {mode === 'review' ? (
                    <ReviewRequest
                      kappSlug={kappSlug}
                      submission={submission}
                    />
                  ) : (
                    <RequestActivityList submission={submission} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
    {discussion && (
      <RequestDiscussion
        discussion={discussion}
        viewDiscussionModal={viewDiscussionModal}
        closeDiscussion={closeDiscussion}
      />
    )}
  </div>
);
