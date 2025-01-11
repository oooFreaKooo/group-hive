<template>
    <aside class="task-details">
        <div class="tag-progress">
            <h2>Task Progress</h2>
            <div
                v-for="progress in taskProgress"
                :key="progress.type"
                class="tag-progress"
            >
                <p>{{ progress.label }} <span>{{ progress.completed }}/{{ progress.total }}</span></p>
                <progress
                    :class="['progress', `progress--${progress.type}`]"
                    :max="progress.total"
                    :value="progress.completed"
                >
                    {{ progress.completed }}
                </progress>
            </div>
        </div>
        <div class="task-activity">
            <h2>Recent Activity</h2>
            <ul>
                <li
                    v-for="activity in recentActivity"
                    :key="activity.id"
                >
                    <span :class="['task-icon', `task-icon--${activity.type}`]">
                        <i :class="activityIcons[activity.type]" />
                    </span>
                    <b>{{ activity.user }} </b>{{ activity.action }}
                    <time :datetime="activity.date">{{ formatDate(activity.date) }}</time>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script lang="ts" setup>
interface Progress {
    label: string
    type: string
    completed: number
    total: number
}

interface Activity {
    id: number
    type: 'attachment' | 'comment' | 'edit'
    user: string
    action: string
    date: string
}

const taskProgress = ref<Progress[]>([
    { label: 'Copywriting', type: 'copyright', completed: 3, total: 8 },
    { label: 'Illustration', type: 'illustration', completed: 6, total: 10 },
    { label: 'UI Design', type: 'design', completed: 2, total: 7 },
])

const activityIcons = {
    attachment: 'fas fa-paperclip',
    comment: 'fas fa-comment',
    edit: 'fas fa-pencil-alt',
}

const recentActivity = ref<Activity[]>([
    {
        id: 1,
        type: 'attachment',
        user: 'Andrea',
        action: 'uploaded 3 documents',
        date: '2021-08-10T20:00:00',
    },
    {
        id: 2,
        type: 'comment',
        user: 'Karen',
        action: 'left a comment',
        date: '2021-08-10T20:00:00',
    },
    {
        id: 3,
        type: 'edit',
        user: 'Karen',
        action: 'uploaded 3 documents',
        date: '2021-08-11T20:00:00',
    },
    {
        id: 4,
        type: 'attachment',
        user: 'Andrea',
        action: 'uploaded 3 documents',
        date: '2021-08-11T20:00:00',
    },
    {
        id: 5,
        type: 'comment',
        user: 'Karen',
        action: 'left a comment',
        date: '2021-08-12T20:00:00',
    },
])

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    })
}
</script>

<style scoped lang="scss">
.task-details {
  width: 24%;
  border-left: 1px solid #d9e0e9;
  display: inline-block;
  height: 100%;
  vertical-align: top;
  padding: 3rem 2rem;
}

.tag-progress {
  margin: 1.5rem 0;

  h2 {
    font-size: 16px;
    margin-bottom: 1rem;
  }

  p {
    display: flex;
    width: 100%;
    justify-content: space-between;

    span {
      color: rgb(180, 180, 180);
    }
  }

  .progress {
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    border: none;
    border-radius: 10px;
    height: 10px;

    &::-webkit-progress-bar,
    &::-webkit-progress-value {
      border-radius: 10px;
    }

    &--copyright {
      &::-webkit-progress-bar {
        background-color: #ecd8e6;
      }

      &::-webkit-progress-value {
        background: #d459e8;
      }
    }

    &--illustration {
      &::-webkit-progress-bar {
        background-color: #dee7e3;
      }

      &::-webkit-progress-value {
        background-color: #46bd84;
      }
    }

    &--design {
      &::-webkit-progress-bar {
        background-color: #d8e7f4;
      }

      &::-webkit-progress-value {
        background-color: #08a0f7;
      }
    }
  }
}

.task-activity {
  h2 {
    font-size: 16px;
    margin-bottom: 1rem;
  }

  li {
    list-style: none;
    margin: 1rem 0;
    padding: 0rem 1rem 1rem 3rem;
    position: relative;
  }

  time {
    display: block;
    color: var(--light-grey);
  }
}

.task-icon {
  width: 30px;
  height: 30px;
  border-radius: 100rem;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 12px;
    color: var(--white);
  }

  &--attachment {
    background-color: #fba63c;
  }

  &--comment {
    background-color: #5dc983;
  }

  &--edit {
    background-color: #7784ee;
  }
}

@media only screen and (max-width: 1300px) {
  .task-details {
    width: 100%;
    display: flex;
  }

  .tag-progress,
  .task-activity {
    flex-basis: 50%;
    background: var(--white);
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem;
  }
}

@media only screen and (max-width: 600px) {
  .task-details {
    flex-wrap: wrap;
    padding: 3rem 1rem;
  }

  .tag-progress,
  .task-activity {
    flex-basis: 100%;
  }
}
</style>
