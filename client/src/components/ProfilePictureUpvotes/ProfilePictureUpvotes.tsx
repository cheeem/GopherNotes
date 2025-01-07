// components/ProfilePictureUpvotes.tsx
import React from "react";
import "./ProfilePictureUpvotes.css";

type ProfilePictureUpvotesProps = {
  avatarUrl: string;
  upvotes: number;
  name?: string;
};

const ProfilePictureUpvotes: React.FC<ProfilePictureUpvotesProps> = ({
  avatarUrl,
  upvotes,
  name,
}) => {
  return (
    <div className="profile-picture-upvotes">
      <div className="avatar-container">
        <img src={avatarUrl} alt={name || "User Avatar"} className="avatar" />
        <span className="upvote-count">{upvotes}</span>
      </div>
    </div>
  );
};

export default ProfilePictureUpvotes;
