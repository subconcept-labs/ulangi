/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

#!/usr/bin/env node

import { spawn } from 'child_process';
import * as commander from 'commander';
import * as inquirer from 'inquirer';

async function exec(): Promise<void> {
  commander
    .option('-n, --envname <host>', 'Environment name')
    .parse(process.argv);

  const answers: any = await inquirer.prompt([
    {
      type: 'input',
      name: 'envname',
      message: 'Enter environment name: ',
      default: commander.envname || 'dev',
    },
    {
      type: 'list',
      name: 'public_ec2',
      message: 'Make EC2 public:',
      choices: ['yes', 'no'],
      default: 'yes',
    },
    {
      type: 'input',
      name: 'vpc_id',
      message: 'Enter VPC ID:',
    },
    {
      type: 'input',
      name: 'vpc_ec2_subnets',
      message: 'Enter VPC Subnets for EC2:',
    },
    {
      type: 'input',
      name: 'vpc_security_group',
      message: 'Enter Security Group ID:',
    },
    {
      type: 'list',
      name: 'load_balancer_type',
      message: 'Select load balancer type:',
      choices: ['none', 'classic', 'application', 'network'],
      default: 'none',
    },
    {
      when: (answers: any): boolean => answers.load_balancer_type !== 'none',
      type: 'list',
      name: 'public_elb',
      message: 'Make ELB public:',
      choices: ['yes', 'no'],
      default: 'yes',
    },
    {
      when: (answers: any): boolean => answers.load_balancer_type !== 'none',
      type: 'input',
      name: 'vpc_elb_subnets',
      message: 'Enter VPC Subnets for ELB:',
    },
  ]);

  const {
    envname,
    public_ec2,
    vpc_id,
    vpc_ec2_subnets,
    vpc_security_group,
    load_balancer_type,
    public_elb,
    vpc_elb_subnets,
  } = answers;

  const args = ['create', envname];

  args.push(
    '--vpc.id',
    vpc_id,
    '--vpc.ec2subnets',
    vpc_ec2_subnets,
    '--vpc.securitygroups',
    vpc_security_group
  );

  if (public_ec2 === 'yes') {
    args.push('--vpc.publicip');
  }

  if (load_balancer_type === 'none') {
    args.push('--single');
  } else {
    args.push('--elb-type', load_balancer_type);

    if (public_elb === 'yes') {
      args.push('--vpc.elbpublic');
    }

    if (vpc_elb_subnets) {
      args.push('--vpc.elbsubnets', vpc_elb_subnets);
    }
  }

  const eb = spawn('eb', args, {
    env: Object.assign({}, process.env, {
      PYTHONUNBUFFERED: true, //Print python stdout
    }),
  });

  eb.stdout.on(
    'data',
    (data): void => {
      console.log(`stdout: ${data}`);
    }
  );

  eb.stderr.on(
    'data',
    (data): void => {
      console.log(`stderr: ${data}`);
    }
  );

  eb.on(
    'close',
    (code): void => {
      console.log(`child process exited with code ${code}`);
    }
  );
}

exec();
