import tape = require('tape')
import promisifyTape from 'tape-promise'
import {installPkgs} from '../../src'
import {prepare, testDefaults} from '../utils'

const test = promisifyTape(tape)

test('fail if installed package does not support the current engine and engine-strict = true', async function (t) {
  const project = prepare(t)

  try {
    await installPkgs(['not-compatible-with-any-os'], testDefaults({
      engineStrict: true
    }))
    t.fail()
  } catch (err) {
    await project.hasNot('not-compatible-with-any-os')
    await project.storeHasNot('not-compatible-with-any-os', '1.0.0')
  }
})

test('do not fail if installed package does not support the current engine and engine-strict = false', async function (t) {
  const project = prepare(t)

  await installPkgs(['not-compatible-with-any-os'], testDefaults({
    engineStrict: false
  }))

  await project.has('not-compatible-with-any-os')
  await project.storeHas('not-compatible-with-any-os', '1.0.0')
})

test('do not fail if installed package requires the node version that was passed in and engine-strict = true', async function (t) {
  const project = prepare(t)

  await installPkgs(['for-legacy-node'], testDefaults({
    engineStrict: true,
    nodeVersion: '0.10.0'
  }))

  await project.has('for-legacy-node')
  await project.storeHas('for-legacy-node', '1.0.0')
})
