<template>
    <div class="app">
        <main class="project">
            <TaskHeader />
            <div class="project-tasks">
                <div
                    v-for="(column, index) in columns"
                    :key="index"
                    class="project-column"
                >
                    <div class="project-column-heading">
                        <h2 class="project-column-heading__title">
                            {{ column.title }}
                        </h2>
                        <button class="project-column-heading__options">
                            <i class="fas fa-ellipsis-h" />
                        </button>
                    </div>
                    <draggable
                        class="task-list"
                        :list="column.tasks"
                        v-bind="dragOptions"
                        @change="handleChange"
                    >
                        <TransitionGroup
                            name="task"
                            type="transition"
                            class="flip-list"
                        >
                            <TaskCard
                                v-for="task in column.tasks"
                                :key="task.id"
                                :task="task"
                            />
                        </TransitionGroup>
                    </draggable>
                </div>
            </div>
        </main>
        <TaskSidebar />
    </div>
</template>

<script setup lang="ts">
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const columns = ref<Column[]>([
    {
        title: 'Task Ready',
        tasks: [
            {
                id: 1,
                tag: { text: 'Copywriting', type: 'copyright' },
                title: 'Konsep hero title yang menarik',
                dueDate: '2021-11-24T20:00:00',
                comments: 3,
                attachments: 7,
            },
            {
                id: 2,
                tag: { text: 'UI Design', type: 'design' },
                title: 'Icon di section our services',
                dueDate: '2021-11-24T20:00:00',
                comments: 2,
                attachments: 5,
            },
        ],
    },
    {
        title: 'In Progress',
        tasks: [
            {
                id: 3,
                tag: { text: 'UI Design', type: 'design' },
                title: 'Replace lorem ipsum text in the final designs',
                dueDate: '2021-11-24T20:00:00',
                comments: 5,
                attachments: 5,
            },
        ],
    },
    {
        title: 'Needs Review',
        tasks: [
            {
                id: 4,
                tag: { text: 'Copywriting', type: 'copyright' },
                title: 'Check the company we copied doesn\'t think we copied them.',
                dueDate: '2021-11-24T20:00:00',
                comments: 4,
                attachments: 0,
            },
        ],
    },
    {
        title: 'Done',
        tasks: [
            {
                id: 5,
                tag: { text: 'Illustration', type: 'illustration' },
                title: 'Send Advert illustrations over to production company.',
                dueDate: '2021-11-24T20:00:00',
                comments: 12,
                attachments: 5,
            },
        ],
    },
])

const dragOptions = computed(() => ({
    animation: 200,
    group: 'tasks',
    disabled: false,
    ghostClass: 'task-ghost',
}))

const handleChange = (event: any) => {
    console.log('Task moved:', event)
}
</script>

<style scoped lang="scss">
body {
  color:var(--text);
}

@mixin display {
  display:flex;
  align-items:center;
}

.app {
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family: 'Poppins', sans-serif;
  background-color:var(--bg);
  width:100%;

  --bg:#ebf0f7;
  --header:#fbf4f6;
  --text:#2e2e2f;
  --white:#ffffff;
  --light-grey:#c4cad3;
  --tag-1:#ceecfd;
  --tag-1-text:#2e87ba;
  --tag-2:#d6ede2;
  --tag-2-text:#13854e;
  --tag-3:#ceecfd;
  --tag-3-text:#2d86ba;
  --tag-4:#f2dcf5;
  --tag-4-text:#a734ba;
  --purple:#7784ee;
}

h1 {
  font-size:30px;
}
.project {
  padding:2rem;
  max-width:75%;
  width:100%;
  display:inline-block;

  &-info {
    padding:2rem 0;
    display:flex;
    width:100%;
    justify-content:space-between;
    align-items:center;
  }
  &-participants {
    @include display;
    span,
    &__add{
      width:30px;
      height:30px;
      display:inline-block;
      background:var(--purple);
      border-radius:100rem;
      margin:0 .2rem;
    }
    &__add {
     background:transparent;
     border:1px dashed rgb(150,150,150);
     font-size:0;
     cursor:pointer;
     position:relative;

      &:after {
        content:'+';
        font-size:15px;
        color:rgb(150,150,150);

      }
    }
  }

  &-tasks {
    display:grid;
    grid-template-columns:repeat(4,1fr);
    width:100%;
    grid-column-gap:1.5rem;
  }
  &-column {

    &-heading {
      margin-bottom:1rem;
      @include display;
      justify-content:space-between;
      &__title {
        font-size:20px;

      }
      &__options {
        background:transparent;
        color:var(--light-grey);
        font-size:18px;
        border:0;
          cursor:pointer;
      }
    }
  }
}

.task {
  cursor:move;
  background-color:var(--white);
  padding:1rem;
  border-radius:8px;
  width:100%;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
  margin-bottom:1rem;
  border:3px dashed transparent;

  &:hover {
     box-shadow: rgba(99, 99, 99, 0.3) 0px 2px 8px 0px;
    border-color:rgba(162,179,207,.2)!important;
  }

  p {
    font-size:15px;
    margin:1.2rem 0;
  }
  &__tag {
    border-radius:100px;
    padding:2px 13px;
    font-size:12px;

    &--copyright {
      color:var(--tag-4-text);
      background-color:var(--tag-4);
    }
    &--design {
       color:var(--tag-3-text);
      background-color:var(--tag-3);
    }
    &--illustration {
      color:var(--tag-2-text);
      background-color:var(--tag-2);
    }

  }
  &__tags {
    width:100%;
    @include display;
    justify-content:space-between;
  }

  &__options {
      background:transparent;
      border:0;
    color:var(--light-grey);
    font-size:17px;
    }

  &__stats {

    position:relative;
    width:100%;
    color:var(--light-grey);

    font-size:12px;
    span:not(:last-of-type){
      margin-right:1rem;
    }
    svg {
      margin-right:5px;
    }
  }

  &__owner {
    width:25px;
    height:25px;
    border-radius:100rem;
    background:var(--purple);
    position:absolute;
    display:inline-block;
    right:0;
    bottom:0;

  }
}

.task-hover {
border:3px dashed var(--light-grey)!important;
}
.task-details {
  width:24%;
  border-left:1px solid #d9e0e9;
  display:inline-block;
  height:100%;
  vertical-align:top;
  padding:3rem 2rem;
}

.tag-progress {
  margin:1.5rem 0;
  h2 {
    font-size:16px;
    margin-bottom:1rem;
  }
  p {
    display:flex;
    width:100%;
    justify-content:space-between;

    span {
      color:rgb(180,180,180);
    }
  }
  .progress {
    width:100%;
    -webkit-appearance: none;
    appearance: none;
    border:none;
    border-radius:10px;
    height:10px;

    &::-webkit-progress-bar,
    &::-webkit-progress-value {
      border-radius:10px;
    }
    &--copyright {
      &::-webkit-progress-bar {
      background-color:#ecd8e6;
    }

    &::-webkit-progress-value {
      background:#d459e8
    }
    }

        &--illustration {
      &::-webkit-progress-bar {
      background-color:#dee7e3;

    }

    &::-webkit-progress-value {
      background-color:#46bd84;
    }
    }

        &--design {
      &::-webkit-progress-bar {

      background-color:#d8e7f4;
    }

    &::-webkit-progress-value {
      background-color:#08a0f7;
    }
    }

  }
}

.task-activity {
   h2 {
    font-size:16px;
    margin-bottom:1rem;
  }

  li {
    list-style:none;
    margin:1rem 0;
    padding:0rem 1rem 1rem 3rem;
    position:relative;
  }
  time {
    display:block;
    color:var(--light-grey);
  }
}

.task-icon {
  width:30px;
  height:30px;
  border-radius:100rem;
  position:absolute;
  top:0;
  left:0;
  @include display;
  justify-content:center;

  svg {
    font-size:12px;
    color:var(--white);
  }
  &--attachment {
    background-color:#fba63c;
  }

  &--comment {
    background-color:#5dc983;
  }

  &--edit {
    background-color:#7784ee;
  }

}

@media only screen and (max-width: 1300px) {
  .project {
    max-width:100%;
  }
  .task-details {
    width:100%;
    display:flex;
  }
  .tag-progress,
  .task-activity {
    flex-basis:50%;
    background:var(--white);
    padding:1rem;
    border-radius:8px;
    margin:1rem;
  }
}

@media only screen and (max-width: 1000px) {
  .project-column:nth-child(2),
  .project-column:nth-child(3){
    display:none;
  }
  .project-tasks {
    grid-template-columns:1fr 1fr;
  }
}

@media only screen and (max-width: 600px) {
  .project-column:nth-child(4){
    display:none;
  }
  .project-tasks {
    grid-template-columns:1fr;
  }

  .task-details {
    flex-wrap:wrap;
    padding:3rem 1rem;
  }
  .tag-progress,
  .task-activity {
    flex-basis:100%;
  }
  h1 {
    font-size:25px;
  }
}

.task-ghost {
    opacity: 0.35;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
