// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// // import { AUTH_API_BASE } from "./api";
// import { setAuthToken, setUserInfo } from "./auth";
// import "./LoginScreen.css";

// function LoginScreen() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [isRegister, setIsRegister] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const from = new URLSearchParams(location.search).get("from") || "/";

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       let response;
//       if (isRegister) {
//         if (!fullName) {
//           setError("氏名を入力してください");
//           setLoading(false);
//           return;
//         }

//         response = await fetch(`${AUTH_API_BASE}/register/`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password, full_name: fullName }),
//         });
//       } else {
//         response = await fetch(`${AUTH_API_BASE}/login/`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ username: email, password }),
//         });
//       }

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "認証に失敗しました");
//       }

//       const data = await response.json();
//       setAuthToken(data.token);
      
//       const userResponse = await fetch(`${AUTH_API_BASE}/user/`, {
//         headers: {
//           Authorization: `Token ${data.token}`,
//         },
//       });
      
//       if (userResponse.ok) {
//         const userData = await userResponse.json();
//         setUserInfo(userData);
//       }

//       navigate(from);
//     } catch (error) {
//       setError(error.message || "認証に失敗しました");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <h2>{isRegister ? "ユーザー登録" : "ログイン"}</h2>
//         {error && <div className="error-message">{error}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="email">メールアドレス</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           {isRegister && (
//             <div className="form-group">
//               <label htmlFor="fullName">氏名</label>
//               <input
//                 type="text"
//                 id="fullName"
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//                 required={isRegister}
//               />
//             </div>
//           )}
//           <div className="form-group">
//             <label htmlFor="password">パスワード</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" disabled={loading}>
//             {loading ? "処理中..." : isRegister ? "登録" : "ログイン"}
//           </button>
//         </form>
//         <div className="toggle-form">
//           <button onClick={() => setIsRegister(!isRegister)}>
//             {isRegister ? "ログイン画面へ" : "新規登録はこちら"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginScreen;
