export module v1 {
    export interface Root {
        id: number
        version: string
        project: string
        goal: string
        sprints: Sprint[]
        team: Team[]
        userStories: UserStory[]
        kanban: string[]
        definitionOfReady: any[]
        definitionOfDone: any[]
        releases: Release[]
      }
      
      export interface Sprint {
        id: number
        sequence: number
        goals: string[]
        startDate: string
        endData: string
        size: number
        userStoriesId: number[]
        daily: Daily[]
      }
      
      export interface Daily {
        day: number
        remainingWork: number
        notes: string[]
      }
      
      export interface Team {
        id: number
        name: string
        availability: number[]
        worked: number[]
        hourRate: number
        position: string
      }
      
      export interface UserStory {
        id: number
        parentId: any
        type: string
        priority: number
        story: string
        acceptanceCriteria: string
        estimation: Estimation
        startDate: string
        endDate: string
        status: string
        workedHours: number
        estimatedHours: number
      }
      
      export interface Estimation {
        interaction: number
        businessRules: number
        entities: number
        dataHandling: number
        calculatedPoints: number;
      }
      
      export interface Release {
        id: number
        name: string
        userStoriesId: number[]
      }
      
}