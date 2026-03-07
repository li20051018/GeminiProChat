import { For, Show, createEffect, createSignal } from 'solid-js'
import IconEnv from './icons/Env'
import IconX from './icons/X'
import SettingsSlider from './SettingsSlider'
import type { Accessor, Setter } from 'solid-js'

interface Props {
  canEdit: Accessor<boolean>
  systemRoleEditing: Accessor<boolean>
  setSystemRoleEditing: Setter<boolean>
  currentSystemRoleSettings: Accessor<string>
  setCurrentSystemRoleSettings: Setter<string>
  temperatureSetting: (value: number) => void
}

const altiumDesignerSkills = [
  {
    name: 'Altium Designer Expert',
    prompt: 'You are an expert in Altium Designer, the professional PCB design software. Help users with schematic capture, PCB layout, routing, component management, and design rule checks. Provide clear, step-by-step guidance and best practices for electronic design.',
  },
  {
    name: 'Schematic Design Assistant',
    prompt: 'You are an Altium Designer schematic design specialist. Help users create and review schematics, manage net labels, configure component properties, use hierarchical design, and ensure correct electrical connectivity. Offer tips for clean and readable schematic layouts.',
  },
  {
    name: 'PCB Layout Advisor',
    prompt: 'You are an Altium Designer PCB layout expert. Assist with component placement, trace routing, ground planes, differential pairs, high-speed design, and EMC/EMI considerations. Provide guidance on layer stackup, design rules, and manufacturing constraints.',
  },
  {
    name: 'Design Rule Check (DRC) Helper',
    prompt: 'You are an Altium Designer DRC specialist. Help users understand and resolve design rule violations, configure DRC rules, interpret error messages, and ensure their PCB designs meet manufacturing and electrical requirements.',
  },
  {
    name: 'Component Library Manager',
    prompt: 'You are an Altium Designer component library expert. Help users create and manage schematic symbols, PCB footprints, and 3D models. Provide guidance on library organization, component search, and linking components to footprints.',
  },
  {
    name: 'Gerber & Fabrication Output',
    prompt: 'You are an Altium Designer fabrication output specialist. Guide users through generating Gerber files, drill files, pick-and-place files, and BOMs. Help configure output settings to meet manufacturer requirements and ensure successful PCB fabrication.',
  },
]

export default (props: Props) => {
  let systemInputRef: HTMLTextAreaElement
  const [temperature, setTemperature] = createSignal(0.6)
  const [showPresets, setShowPresets] = createSignal(false)

  const handleButtonClick = () => {
    props.setCurrentSystemRoleSettings(systemInputRef.value)
    props.setSystemRoleEditing(false)
  }

  const applyPreset = (prompt: string) => {
    systemInputRef.value = prompt
    setShowPresets(false)
  }

  createEffect(() => {
    props.temperatureSetting(temperature())
  })

  return (
    <div class="my-4">
      <Show when={!props.systemRoleEditing()}>
        <Show when={props.currentSystemRoleSettings()}>
          <div>
            <div class="fi gap-1 op-50 dark:op-60">
              <Show when={props.canEdit()} fallback={<IconEnv />}>
                <span onClick={() => props.setCurrentSystemRoleSettings('')} class="sys-edit-btn p-1 rd-50%" > <IconX /> </span>
              </Show>
              <span>System Role ( Temp = {temperature()} ) : </span>
            </div>
            <div class="mt-1">
              {props.currentSystemRoleSettings()}
            </div>
          </div>
        </Show>
        <Show when={!props.currentSystemRoleSettings() && props.canEdit()}>
          <span onClick={() => props.setSystemRoleEditing(!props.systemRoleEditing())} class="sys-edit-btn">
            <IconEnv />
            <span>Add System Role</span>
          </span>
        </Show>
      </Show>
      <Show when={props.systemRoleEditing() && props.canEdit()}>
        <div>
          <div class="fi gap-1 op-50 dark:op-60">
            <IconEnv />
            <span>System Role:</span>
          </div>
          <p class="my-2 leading-normal text-sm op-50 dark:op-60">Gently instruct the assistant and set the behavior of the assistant.</p>
          <div class="mb-2">
            <button
              onClick={() => setShowPresets(!showPresets())}
              class="text-sm px-3 py-1 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {showPresets() ? 'Hide' : 'Altium Designer Skills'}
            </button>
            <Show when={showPresets()}>
              <div class="mt-2 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden">
                <div class="px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs font-medium op-70">
                  Preset skills for Altium Designer
                </div>
                <For each={altiumDesignerSkills}>
                  {skill => (
                    <button
                      onClick={() => applyPreset(skill.prompt)}
                      class="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 border-t border-slate-100 dark:border-slate-700 transition-colors"
                    >
                      <div class="font-medium">{skill.name}</div>
                      <div class="text-xs op-60 mt-0.5 line-clamp-1">{skill.prompt.length > 80 ? `${skill.prompt.substring(0, 80)}...` : skill.prompt}</div>
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </div>
          <div>
            <textarea
              ref={systemInputRef!}
              placeholder="You are a helpful assistant, answer as concisely as possible...."
              autocomplete="off"
              autofocus
              rows="3"
              gen-textarea
            />
          </div>
          <div class="w-full fi fb">
            <button onClick={handleButtonClick} gen-slate-btn>
              Set
            </button>
            <div class="w-full ml-2">
              <SettingsSlider
                settings={{
                  name: 'Temperature',
                  type: 'slider',
                  min: 0,
                  max: 2,
                  step: 0.01,
                }}
                editing={() => true}
                value={temperature}
                setValue={setTemperature}
              />
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
