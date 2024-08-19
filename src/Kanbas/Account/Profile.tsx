import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";

export default function Profile() {
    const [profile, setProfile] = useState<any>({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchProfile = async () => {
        try {
            const account = await client.profile();
            setProfile(account);
        } catch (err: any) {
            navigate("/Kanbas/Account/Signin");
        }
    };

    const signout = async () => {
        await client.signout();
        dispatch(setCurrentUser(null));
        navigate("/Kanbas/Account/Signin");
    };

    const updateProfile = async () => {
        await client.updateProfile(profile);

    };

    useEffect(() => { fetchProfile(); }, []);

    return (
        <div className="wd-profile-screen">
            <h1>Profile</h1>
            {profile && (
                <div>
                    <input className="wd-username form-control mb-2" value={profile.username} placeholder="username"
                            onChange={(e) => setProfile({ ...profile, username:  e.target.value })}/>
                    <input className="wd-password form-control mb-2" value={profile.password} placeholder="password"
                            onChange={(e) => setProfile({ ...profile, password:  e.target.value })}/>
                    <input className="wd-firstname form-control mb-2" value={profile.firstName} placeholder="first name"
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}/>
                    <input className="wd-lastname form-control mb-2" value={profile.lastName} placeholder="last name"
                            onChange={(e) => setProfile({ ...profile, lastName:  e.target.value })}/>
                    <input className="wd-dob form-control mb-2" value={profile.dob} placeholder="date of birth"
                            onChange={(e) => setProfile({ ...profile, dob: e.target.value })} type="date"/>
                    <input className="wd-email form-control mb-2" value={profile.email} placeholder="email"
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}/>
                    <select className="wd-role form-control mb-2" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="STUDENT">Student</option>
                    </select>

                    <button onClick={updateProfile} className="wd-update-btn btn btn-success w-100">Update Profile</button>
                    <br />
                    <br />
                    <button onClick={signout} className="wd-signout-btn btn btn-danger w-100">
                        Sign out
                    </button>
                </div>
                
            )}
        </div>
    );
}
