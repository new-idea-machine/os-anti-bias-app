import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Resume } from '../interfaces/resume';
import { EventEmitter } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-resume-form',
  templateUrl: './resume-form.component.html',
  styleUrls: ['./resume-form.component.css']
})


export class ResumeFormComponent implements OnInit {
  @Input() resume: Resume | undefined;
  @Output() formSubmitted = new EventEmitter();
  @Output() cancelEdit = new EventEmitter();
  resumeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.resumeForm = this.fb.group({
      title: [''],
      summary: [''],
      skills: this.fb.array([]),
      education: this.fb.array([]),
      workExperience: this.fb.array([]),
      contactInformation: this.fb.group({
        phoneNumber: [''],
        emailAddress: [''],
        linkedInProfile: [''],
        otherSocialMedia: ['']
      }),
      projects: this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.resume) {
      this.populateForm(this.resume);
    } else {
      this.addSkill();
      this.addEducation();
      this.addWorkExperience();
      this.addProject();
    }

  }

  populateForm(resume: Resume) {
    this.resumeForm.patchValue({
      resume_id: resume.resume_id,
      title: resume.title,
      summary: resume.summary,
      contactInformation: resume.contactInformation
    });

    resume.skills.forEach(skill => this.skills.push(this.fb.control(skill)));
    resume.education.forEach(edu => this.education.push(this.fb.group({
      degree: [edu.degree, Validators.required],
      school: [edu.school, Validators.required],
      major: [edu.major, Validators.required],
      graduationYear: [edu.graduationYear, Validators.required]
    })));

    resume.workExperience.forEach(work => this.workExperience.push(this.fb.group({
      jobTitle: [work.jobTitle, Validators.required],
      company: [work.company, Validators.required],
      location: [work.location, Validators.required],
      startDate: [work.startDate, Validators.required],
      endDate: [work.endDate, Validators.required],
      responsibilities: this.fb.array(work.responsibilities.map(res => this.fb.control(res))),
      achievements: this.fb.array(work.achievements.map(ach => this.fb.control(ach)))
    })));

    resume.projects.forEach(project => this.projects.push(this.fb.group({
      projectName: [project.projectName, Validators.required],
      description: [project.description, Validators.required],
      rolesResponsibilities: this.fb.array(project.rolesResponsibilities.map(role => this.fb.control(role))),
      technologiesUsed: this.fb.array(project.technologiesUsed.map(tech => this.fb.control(tech)))
    })));

  }

  get skills(): FormArray {
    return this.resumeForm.get('skills') as FormArray;
  }

  get education(): FormArray {
    return this.resumeForm.get('education') as FormArray;
  }

  get workExperience(): FormArray {
    return this.resumeForm.get('workExperience') as FormArray;
  }

  getWorkExperienceResponsibilities(workIndex: number): FormArray {
    return this.workExperience.at(workIndex).get('responsibilities') as FormArray;
  }

  getWorkExperienceAchievements(workIndex: number): FormArray {
    return this.workExperience.at(workIndex).get('achievements') as FormArray;
  }

  get projects(): FormArray {
    return this.resumeForm.get('projects') as FormArray;
  }

  getProjectRolesResponsibilties(projectIndex: number): FormArray {
    return this.projects.at(projectIndex).get('rolesResponsibilities') as FormArray;
  }

  getProjectTechnologiesUsed(projectIndex: number): FormArray {
    return this.projects.at(projectIndex).get('technologiesUsed') as FormArray;
  }


  addSkill() {
    this.skills.push(this.fb.control('', Validators.required));
  }

  addEducation() {
    this.education.push(this.fb.group({
      degree: ['', Validators.required],
      school: ['', Validators.required],
      major: ['', Validators.required],
      graduationYear: [null, Validators.required]
    }));
  }

  addWorkExperience() {
    this.workExperience.push(this.fb.group({
      jobTitle: ['', Validators.required],
      company: ['', Validators.required],
      location: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      responsibilities: this.fb.array([]),
      achievements: this.fb.array([])
    }));
  }

  addResponsibility(workIndex: number) {
    this.getWorkExperienceResponsibilities(workIndex).push(this.fb.control(''));
  }

  addAchievement(workIndex: number) {
    this.getWorkExperienceAchievements(workIndex).push(this.fb.control(''));
  }

  addProject() {
    this.projects.push(this.fb.group({
      projectName: ['', Validators.required],
      description: ['', Validators.required],
      rolesResponsibilities: this.fb.array([]),
      technologiesUsed: this.fb.array([])
    }));
  }

  addRoleResponsibility(projectIndex: number) {
    this.getProjectRolesResponsibilties(projectIndex).push(this.fb.control(''));
  }

  addTechnology(projectIndex: number) {
    this.getProjectTechnologiesUsed(projectIndex).push(this.fb.control(''));
  }


  //FORM SUBMIT HANDLER
  onSubmit(): void {
    // Check if the form is valid before proceeding
    // Skills Array - remove empty string


    if (this.resumeForm.valid) {
      // Update the resume object with form values
      const updatedResume= {
        ...this.resume,
        ...this.resumeForm.value
      };
      this.formSubmitted.emit(updatedResume);

    }
  }

  cancelEditMode(): void {
    this.cancelEdit.emit();
  }

}






