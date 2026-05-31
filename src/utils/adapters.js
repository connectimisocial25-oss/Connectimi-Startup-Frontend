/**
 * Translates frontend camelCase profile data into backend snake_case MongoDB payloads.
 */
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
  if (data.foundedDate !== undefined) {
    payload.founded_date = data.foundedDate ? new Date(data.foundedDate).toISOString() : null;
  }
  if (data.industry !== undefined) payload.industry = data.industry;

  if (data.profileImage !== undefined) payload.profile_picture = data.profileImage;
  if (data.profilePicture !== undefined) payload.profile_picture = data.profilePicture;
  if (data.bannerImage !== undefined) payload.banner_image = data.bannerImage;

  if (data.specialties !== undefined) payload.specialties = data.specialties;

  if (data.skills !== undefined) {
    payload.skills = data.skills.map((skill) => {
      if (typeof skill === "string") {
        return { skill_name: skill, proficiency_level: "beginner" };
      }
      return {
        skill_name: skill.skill_name || skill.skillName || "",
        proficiency_level: skill.proficiency_level || skill.proficiencyLevel || "beginner",
      };
    });
  }

  if (data.experience !== undefined) {
    payload.experiences = data.experience.map((exp) => ({
      title: exp.title,
      company: exp.company,
      location: exp.location || "",
      start_date: exp.startDate ? new Date(exp.startDate).toISOString() : new Date().toISOString(),
      end_date: exp.endDate ? new Date(exp.endDate).toISOString() : null,
      description: exp.description || "",
    }));
  }

  if (data.projects !== undefined) {
    payload.projects = data.projects.map((proj) => ({
      project_name: proj.title || proj.projectName || "",
      project_url: proj.link || proj.projectUrl || "",
      description: proj.description || "",
    }));
  }

  if (data.education !== undefined) {
    payload.educations = data.education.map((edu) => ({
      school: edu.school,
      degree: edu.degree || "",
      field_of_study: edu.field || edu.fieldOfStudy || "",
      start_date: edu.startYear ? new Date(`${edu.startYear}-01-01`).toISOString() : null,
      end_date: edu.endYear ? new Date(`${edu.endYear}-01-01`).toISOString() : null,
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

  const names = (user.full_name || "").split(" ");
  const firstName = names[0] || "";
  const lastName = names.slice(1).join(" ") || "";

  return {
    id: user.id || user._id,
    email: user.email,
    phone: user.phone || "",
    firstName,
    lastName,
    name: user.full_name || "",
    headline: user.headline || "",
    about: user.bio || "",
    bio: user.bio || "",
    location: user.location || "",
    role: user.role || "professional",
    companySize: user.company_size || "",
    foundedDate: user.founded_date ? user.founded_date.substring(0, 10) : "",
    specialties: user.specialties || [],
    industry: user.industry || "",
    profileImage: user.profile_picture || "",
    profilePicture: user.profile_picture || "",
    bannerImage: user.banner_image || "",
    skills: (user.skills || []).map((s) => s.skill_name),
    experience: (user.experiences || []).map((exp) => ({
      id: exp._id || exp.id,
      title: exp.title,
      company: exp.company,
      location: exp.location,
      startDate: exp.start_date ? exp.start_date.substring(0, 7) : "",
      endDate: exp.end_date ? exp.end_date.substring(0, 7) : "",
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
      startYear: edu.start_date ? edu.start_date.substring(0, 4) : "",
      endYear: edu.end_date ? edu.end_date.substring(0, 4) : "",
      description: edu.description,
    })),
    urls: user.urls || [],
    following: user.following || [],
    followers: user.followers || [],
  };
}
