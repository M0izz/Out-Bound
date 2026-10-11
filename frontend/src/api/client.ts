const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export interface UserProfile {
  id: number;
  username: string;
  title: string;
  avatar: string;
  level: number;
  level_title: string;
  xp: number;
  xp_to_next_level: number;
  grass_balance: number;
  current_streak: number;
  longest_streak: number;
  streak_milestone: string;
  completed_quests_count: number;
  outdoor_hours: number;
  global_rank: number;
  college_rank: number;
  friends_rank: number;
  preferred_categories: string[];
  disliked_categories: string[];
  preferred_difficulty: string;
  streak_shield_active: boolean;
  profile_frame: string;
  rank_summary: {
    global: number;
    college: number;
    friends: number;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  duration_minutes: number;
  steps: string[];
  proof_type: string;
  proof_hint: string;
  generated_by: string;
  generation_reason: string;
  xp_reward: number;
  grass_reward: number;
  is_daily_drop: boolean;
  drop_tier?: "chill" | "explorer" | "hardcore" | null;
  status: "available" | "active" | "completed" | "abandoned";
  accepted_at?: string | null;
  completed_at?: string | null;
}

export interface VerificationResult {
  quest_id: string;
  verification_status: "VERIFIED" | "REJECTED";
  confidence_score: number;
  reason: string;
  checks_passed: string[];
  warnings: string[];
  xp_awarded: number;
  grass_awarded: number;
  new_level: number;
  level_up: boolean;
  new_streak: number;
  badges_unlocked: Array<{
    name: string;
    icon: string;
    description: string;
  }>;
  game_master_reflection: string;
}

export interface Challenge {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  badge_name: string;
  badge_icon: string;
  target_count: number;
  current_count: number;
  progress_percentage: number;
  xp_reward: number;
  grass_reward: number;
  end_date: string;
  is_active: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  unlocked_at?: string | null;
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  level: number;
  level_title: string;
  xp: number;
  grass_balance: number;
  badges_count: number;
  is_current_user: boolean;
}

export interface LeaderboardResponse {
  category: string;
  users: LeaderboardUser[];
  user_standing: LeaderboardUser;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price_grass: number;
  icon: string;
  item_type: string;
  is_available: boolean;
}

export interface RewardTransaction {
  id: number;
  transaction_type: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

export interface ExplorationSector {
  id: string;
  sector_name: string;
  zone: string;
  grid_x: number;
  grid_y: number;
  fog_status: "unexplored" | "discovered" | "mastered";
  discovery_level: number;
  icon: string;
}

export interface ExplorationSummary {
  explored_percentage: number;
  total_sectors: number;
  discovered_sectors: number;
  mastered_sectors: number;
  sectors: ExplorationSector[];
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/user/profile`);
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

export async function fetchUserBadges(): Promise<Badge[]> {
  const res = await fetch(`${API_BASE}/user/badges`);
  if (!res.ok) throw new Error("Failed to fetch badges");
  return res.json();
}

export async function fetchUserTransactions(): Promise<RewardTransaction[]> {
  const res = await fetch(`${API_BASE}/user/transactions`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

export async function fetchDailyQuests(): Promise<Quest[]> {
  const res = await fetch(`${API_BASE}/quests/daily`);
  if (!res.ok) throw new Error("Failed to fetch daily quests");
  return res.json();
}

export async function fetchActiveQuest(): Promise<Quest | null> {
  const res = await fetch(`${API_BASE}/quests/active`);
  if (!res.ok) throw new Error("Failed to fetch active quest");
  return res.json();
}

export async function generateCustomQuest(params: {
  available_time?: number;
  category?: string;
  difficulty?: string;
  prompt_hint?: string;
}): Promise<Quest> {
  const res = await fetch(`${API_BASE}/quests/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to generate quest");
  return res.json();
}

export async function acceptQuest(questId: string): Promise<Quest> {
  const res = await fetch(`${API_BASE}/quests/${questId}/accept`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to accept quest");
  return res.json();
}

export async function abandonQuest(questId: string): Promise<Quest> {
  const res = await fetch(`${API_BASE}/quests/${questId}/abandon`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to abandon quest");
  return res.json();
}

export async function submitQuestProof(
  questId: string,
  data: {
    duration_minutes: number;
    distance_km?: number;
    photo_description?: string;
    notes?: string;
    user_declared_honest?: boolean;
  }
): Promise<VerificationResult> {
  const res = await fetch(`${API_BASE}/quests/${questId}/proof`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quest_id: questId,
      ...data,
      user_declared_honest: data.user_declared_honest ?? true,
    }),
  });
  if (!res.ok) throw new Error("Verification submission failed");
  return res.json();
}

export async function fetchChallenges(): Promise<Challenge[]> {
  const res = await fetch(`${API_BASE}/challenges`);
  if (!res.ok) throw new Error("Failed to fetch challenges");
  return res.json();
}

export async function fetchLeaderboard(category: "global" | "college" | "friends"): Promise<LeaderboardResponse> {
  const res = await fetch(`${API_BASE}/leaderboard?category=${category}`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

export async function fetchShopItems(): Promise<ShopItem[]> {
  const res = await fetch(`${API_BASE}/shop/items`);
  if (!res.ok) throw new Error("Failed to fetch shop items");
  return res.json();
}

export async function purchaseShopItem(itemId: string): Promise<{ success: boolean; message: string; new_grass_balance: number }> {
  const res = await fetch(`${API_BASE}/shop/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item_id: itemId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Purchase failed" }));
    throw new Error(err.detail || "Purchase failed");
  }
  return res.json();
}

export async function fetchExplorationSummary(): Promise<ExplorationSummary> {
  const res = await fetch(`${API_BASE}/exploration/summary`);
  if (!res.ok) throw new Error("Failed to fetch exploration summary");
  return res.json();
}
