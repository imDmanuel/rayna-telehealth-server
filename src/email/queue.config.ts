import { BullModule } from '@nestjs/bullmq';

// TODO: FIX THIS
export const BullMQConfig = BullModule.forRoot({
  connection: {
    host: 'redis-19225.c256.us-east-1-2.ec2.redns.redis-cloud.com', // Replace with your Redis host
    port: 19225, // Replace with your Redis port
    password: 'l3vri87lFmtXdq1YBKZY2WkvKrtVkEXs',
  },
});
