import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function signToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function authResponse(user) {
  return {
    token: signToken(user),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

export async function register(req, res) {
  const { name, email, password, role, farmLocation } = req.body;
  const store = req.app.locals.mockStore;
  const mockMode = req.app.locals.mockMode;
  const existing = mockMode
    ? store.findUserByEmail(email)
    : await User.findOne({ email: email.toLowerCase() }).lean();

  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = mockMode
    ? store.createUser({
        name,
        email,
        role: role || "Farmer",
        farmLocation,
        passwordHash
      })
    : await User.create({
        name,
        email,
        role: role || "Farmer",
        farmLocation,
        passwordHash
      });

  return res.status(201).json(authResponse(user));
}

export async function login(req, res) {
  const store = req.app.locals.mockStore;
  const mockMode = req.app.locals.mockMode;
  const user = mockMode
    ? store.findUserByEmail(req.body.email)
    : await User.findOne({ email: req.body.email.toLowerCase() });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (req.body.expectedRole && req.body.expectedRole !== user.role) {
    return res.status(403).json({ message: `This account is registered as ${user.role}` });
  }

  return res.json(authResponse(user));
}

export async function getSession(req, res) {
  return res.json({ user: req.user });
}
