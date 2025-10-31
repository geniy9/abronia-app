export default defineAppConfig({
  ui: {

    icons: {
      loading: 'svg-spinners:90-ring'
    },

    button: {
      slots: {
        base: [
          'cursor-pointer',
        ]
      },
      variants: {
        variant: {
          solid: 'text-white dark:text-white',
        }
      }
    },

    input: {
      slots: {
        base: [
          'placeholder:text-gray-400 dark:placeholder:text-gray-400',
        ],
        leadingIcon: 'shrink-0 text-gray-400',
      },
      variants: {
        variant: {
          custom: 'text-highlighted bg-black/10 dark:bg-white/20 hover:bg-white/30 focus:bg-white/30 disabled:bg-elevated/50',
        },
      }
    },

    textarea: {
      slots: {
        base: [
          '',
        ]
      }
    },

    card: {
      slots: {
        header: 'p-4 sm:px-4',
        body: 'p-4 sm:p-4',
        footer: 'p-4 sm:px-4'
      }
    },

    formField: {
      slots: {
        label: 'text-gray-400 tracking-wider text-xs',
      },
    },

    inputNumber: {
      slots: {
        increment: '[&>button]:cursor-pointer',
        decrement: '[&>button]:cursor-pointer'
      }
    },

    accordion: {
      slots: {
        leadingIcon: 'text-gray-900 dark:text-white',
        trailingIcon: 'text-gray-900 dark:text-white',
        label: 'text-gray-900 dark:text-white'
      }
    },

    pagination: {
      slots: {
        first: 'cursor-pointer',
        prev: 'cursor-pointer',
        item: 'cursor-pointer',
        next: 'cursor-pointer',
        last: 'cursor-pointer'
      }
    },

    table: {
      slots: {
        tbody: 'divide-y divide-gray-300',
        th: 'px-2 py-2', 
        td: 'px-2 py-2 text-sm'
      }
    },

    tabs: {
      slots: {
        trigger: [
          'grow cursor-pointer data-[state=active]:bg-primary',
        ]
      }
    },

    skeleton: {
      base: 'bg-gray-300'
    },

    switch: {
      slots: {
        base: [
          'data-[state=unchecked]:bg-gray-400',
        ],
        thumb: 'bg-white data-[state=unchecked]:translate-x-0 data-[state=unchecked]:rtl:-translate-x-0',
        icon: [
          'group-data-[state=unchecked]:text-gray-900 opacity-0',
        ],
        label: 'block font-medium text-default',
      }
    },

    chip: {
      slots: {
        base: 'ring-0 px-2'
      },
      variants: {
        position: {
          'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'
        },
      },
    }

  }
})
