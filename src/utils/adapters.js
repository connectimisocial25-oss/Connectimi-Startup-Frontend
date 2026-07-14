/**
 * Translates frontend camelCase profile data into backend snake_case MongoDB payloads.
 */

/**
 * Pads a short "YYYY-MM" string to "YYYY-MM-DD" (appending "-01") so it passes
 * the Zod .date() validator on the backend which expects full ISO dates.
 * Full "YYYY-MM-DD" strings and nullish values are returned unchanged.
 */
const ensureFullDate = (value) => {
  if (!value || value === "Present") return value || null;
  const s = String(value).trim();
  // Already full date
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // Short YYYY-MM → pad to first of month
  if (/^\d{4}-\d{2}$/.test(s)) return `${s}-01`;
  // Fallback — try coercing via Date constructor
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

const formatDatePart = (value, length) => {
  if (value === null || value === undefined || value === "") return "";

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? ""
      : value.toISOString().slice(0, length);
  }

  const stringValue = String(value);
  if (stringValue === "Present") return stringValue;

  return stringValue.slice(0, length);
};

export function transformProfileToBackend(data) {
  const payload = {};

  if (data.firstName !== undefined || data.lastName !== undefined) {
    payload.full_name = `${data.firstName || ""} ${data.lastName || ""}`.trim();
  } else if (data.name !== undefined) {
    payload.full_name = data.name;
  }

  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.headline !== undefined) payload.headline = data.headline;
  if (data.about !== undefined) payload.bio = data.about;
  if (data.bio !== undefined) payload.bio = data.bio;
  if (data.location !== undefined) payload.location = data.location;
  if (data.role !== undefined) payload.role = data.role;
  if (data.companySize !== undefined) payload.company_size = data.companySize;
  if (data.industry !== undefined) payload.industry = data.industry;

  if (data.profileImage !== undefined)
    payload.profile_picture = data.profileImage;
  if (data.profilePicture !== undefined)
    payload.profile_picture = data.profilePicture;
  if (data.bannerImage !== undefined) payload.banner_image = data.bannerImage;

  if (data.specialties !== undefined) payload.specialties = data.specialties;

  if (data.skills !== undefined) {
    payload.skills = data.skills.map((skill) => {
      if (typeof skill === "string") {
        return { skill_name: skill, proficiency_level: "beginner" };
      }
      return {
        skill_name: skill.skill_name || skill.skillName || "",
        proficiency_level:
          skill.proficiency_level || skill.proficiencyLevel || "beginner",
      };
    });
  }

  if (data.experience !== undefined) {
    payload.experiences = data.experience.map((exp) => ({
      title: exp.title,
      company: exp.company,
      location: exp.location || "",
      start_date:
        ensureFullDate(exp.startDate) || new Date().toISOString().slice(0, 10),
      end_date: ensureFullDate(exp.endDate) || undefined,
      description: exp.description || "",
    }));
  }

  if (data.projects !== undefined) {
    payload.projects = data.projects.map((proj) => ({
      project_name: proj.title || proj.projectName || "",
      project_url: proj.link || proj.projectUrl || undefined,
      description: proj.description || "",
    }));
  }

  if (data.education !== undefined) {
    payload.educations = data.education
      // Only include educations with a school name AND a valid start year >= 1900
      .filter((edu) => {
        const year = Number(edu.startYear);
        return edu.school && !Number.isNaN(year) && year >= 1900;
      })
      .map((edu) => ({
        school: edu.school,
        degree: edu.degree || "",
        field_of_study: edu.field || edu.fieldOfStudy || "",
        start_date: Number(edu.startYear),
        end_date: edu.endYear && !Number.isNaN(Number(edu.endYear))
          ? Number(edu.endYear)
          : edu.endYear === "Present"
          ? "Present"
          : undefined,
        description: edu.description || "",
      }));
  }

  if (data.urls !== undefined) payload.urls = data.urls;

  return payload;
}

/**
 * Translates backend snake_case MongoDB response models into camelCase attributes used by frontend components.
 */
export function transformProfileToFrontend(user) {
  if (!user) return null;

  const names = (user.full_name || user.consultant_name || "").split(" ");
  const firstName = names[0] || "";
  const lastName = names.slice(1).join(" ") || "";

  return {
    id: user.id || user._id,
    email: user.email,
    accountType: user.account_type || (user.role === "professional" ? "personal" : "consultant"),
    phone: user.phone || "",
    firstName,
    lastName,
    name: user.full_name || user.consultant_name || "",
    headline: user.headline || "",
    about: user.bio || "",
    bio: user.bio || "",
    location: user.location || "",
    role: user.role || "professional",
    companySize: user.company_size || "",
    foundedDate: formatDatePart(user.founded_date, 10),
    specialties: user.specialties || [],
    industry: user.industry || "",
    profileImage: user.profile_picture || user.logo || "",
    profilePicture: user.profile_picture || user.logo || "",
    bannerImage: user.banner_image || user.banner || "",
    skills: (user.skills || []).map((s) => s.skill_name),
    experience: (user.experiences || []).map((exp) => ({
      id: exp._id || exp.id,
      title: exp.title,
      company: exp.company,
      location: exp.location,
      startDate: formatDatePart(exp.start_date, 7),
      endDate: formatDatePart(exp.end_date, 7),
      description: exp.description,
    })),
    projects: (user.projects || []).map((p) => ({
      id: p._id || p.id,
      title: p.project_name,
      link: p.project_url,
      description: p.description,
    })),
    education: (user.educations || []).map((edu) => ({
      id: edu._id || edu.id,
      school: edu.school,
      degree: edu.degree,
      field: edu.field_of_study,
      startYear: formatDatePart(edu.start_date, 4),
      endYear: formatDatePart(edu.end_date, 4),
      description: edu.description,
    })),
    urls: user.urls || [],
    following: user.following || [],
    followers: user.followers || [],
  };
}
